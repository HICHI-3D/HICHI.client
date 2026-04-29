/**
 * 가구 스캔 잡의 상태를 주기적으로 폴링하는 훅.
 */

import type { FurnitureRecord } from '@entities/furniture';
import { getFurniture } from '@shared/api';
import { useEffect, useRef, useState } from 'react';

const POLL_INTERVAL_MS = 1500;

type Result =
  | { phase: 'idle' }
  | { phase: 'polling'; record: FurnitureRecord }
  | { phase: 'completed'; record: FurnitureRecord }
  | { phase: 'failed'; record: FurnitureRecord }
  | { phase: 'error'; message: string };

export function useScanProgress(furnitureId: number | null): Result {
  const [state, setState] = useState<Result>({ phase: 'idle' });
  const cancelledRef = useRef(false);

  useEffect(() => {
    if (furnitureId == null) {
      setState({ phase: 'idle' });
      return;
    }
    cancelledRef.current = false;

    const tick = async () => {
      try {
        const record = await getFurniture(furnitureId);
        if (cancelledRef.current) return;

        if (record.scan_status === 'completed') {
          setState({ phase: 'completed', record });
          return;
        }
        if (
          record.scan_status === 'failed' ||
          record.scan_status === 'cancelled'
        ) {
          setState({ phase: 'failed', record });
          return;
        }
        setState({ phase: 'polling', record });
        timer = setTimeout(tick, POLL_INTERVAL_MS);
      } catch (e) {
        if (cancelledRef.current) return;
        setState({
          phase: 'error',
          message: e instanceof Error ? e.message : '폴링 실패',
        });
      }
    };

    let timer = setTimeout(tick, 0);
    return () => {
      cancelledRef.current = true;
      clearTimeout(timer);
    };
  }, [furnitureId]);

  return state;
}
