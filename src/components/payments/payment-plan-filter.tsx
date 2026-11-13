'use client';

import { Add01Icon } from '@hugeicons/core-free-icons';
import { useId } from 'react';

import { Button } from '@/components/shared/button';
import type { MembershipPlan } from '@/lib/contracts';

import styles from './payment-plan-filter.module.css';

export function PaymentPlanFilter({
	plans,
	selectedIds,
	cursor,
	loading,
	unavailable,
	onSelectionChange,
	onLoadMore,
}: {
	readonly plans: readonly MembershipPlan[];
	readonly selectedIds: readonly string[];
	readonly cursor: string | null;
	readonly loading: boolean;
	readonly unavailable: boolean;
	readonly onSelectionChange: (ids: string[]) => void;
	readonly onLoadMore: () => void;
}) {
	const selectId = useId();
	const hintId = `${selectId}-hint`;

	return (
		<div className={styles.field}>
			<label htmlFor={selectId}>Membership plans</label>
			<select
				id={selectId}
				className={styles.select}
				multiple
				size={Math.min(Math.max(plans.length, 2), 4)}
				value={[...selectedIds]}
				aria-describedby={hintId}
				onChange={(event) => {
					const selected = Array.from(
						event.currentTarget.selectedOptions,
						(option) => option.value,
					);
					onSelectionChange(selected);
				}}
			>
				{plans.map((plan) => (
					<option
						key={plan.id}
						value={plan.id}
						disabled={!selectedIds.includes(plan.id) && selectedIds.length >= 24}
					>
						{plan.name}{plan.status === 'ARCHIVED' ? ' (Archived)' : ''}
					</option>
				))}
			</select>
			<p id={hintId} className={styles.hint}>
				Select up to 24 plans with Ctrl (Windows/Linux) or Command (Mac). Payments matching any
				selected plan are shown.
			</p>
			{unavailable ? (
				<p className={styles.unavailable} role="status">
					Additional membership plans could not be loaded.
				</p>
			) : null}
			{cursor !== null && !unavailable ? (
				<Button
					icon={Add01Icon}
					variant="secondary"
					width="full"
					pending={loading}
					disabled={loading}
					onClick={onLoadMore}
				>
					Load more plans
				</Button>
			) : null}
		</div>
	);
}
