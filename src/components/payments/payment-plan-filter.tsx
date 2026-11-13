'use client';

import { Add01Icon } from '@hugeicons/core-free-icons';

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
	return (
		<fieldset className={styles.filters}>
			<legend>Membership plans</legend>
			<p>Select one or more plans. Payments matching any selected plan will be shown.</p>
			<div className={styles.options}>
				{plans.map((plan) => {
					const checked = selectedIds.includes(plan.id);
					return (
						<label className={styles.option} key={plan.id}>
							<input
								type="checkbox"
								checked={checked}
								disabled={!checked && selectedIds.length >= 24}
								onChange={(event) => {
								onSelectionChange(
									event.target.checked
										? [...selectedIds, plan.id]
										: selectedIds.filter((id) => id !== plan.id),
								);
							}}
							/>
							<span>{plan.name}</span>
							{plan.status === 'ARCHIVED' ? <small>Archived</small> : null}
						</label>
					);
				})}
			</div>
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
		</fieldset>
	);
}
