import type { Metadata } from 'next';

import { kigaliCalendarDate } from '@/components/payments/payment-subscription-remaining';
import { PaymentsWorkspace } from '@/components/payments/payments-workspace';
import type { MembershipPlan, Payment } from '@/lib/contracts';
import { listPayments } from '@/lib/server/endpoints/payments/list-payments';
import { listMembershipPlans } from '@/lib/server/endpoints/membership-plans/list-membership-plans';
import { requireOwnerPortalSession } from '@/lib/server/session';
import { UpstreamError } from '@/lib/server/upstream';

export const metadata: Metadata = { title: 'Payments' };

export default async function PaymentsPage() {
	await requireOwnerPortalSession();
	let initialItems: Payment[] = [];
	let initialNextCursor: string | null = null;
	let initialErrorStatus: number | null = null;
	let initialPlans: MembershipPlan[] = [];
	let initialPlanCursor: string | null = null;
	let planFilterUnavailable = false;
	try {
		const page = await listPayments({ order: 'NEWEST', limit: 24 });
		initialItems = page.items;
		initialNextCursor = page.nextCursor;
	} catch (error: unknown) {
		initialErrorStatus = error instanceof UpstreamError ? error.status : 503;
	}
	try {
		const plans = await listMembershipPlans({ status: 'ALL', order: 'NAME_ASC', limit: 24 });
		initialPlans = plans.items;
		initialPlanCursor = plans.nextCursor;
	} catch {
		planFilterUnavailable = true;
	}
	return (
		<PaymentsWorkspace
			initialItems={initialItems}
			initialNextCursor={initialNextCursor}
			initialErrorStatus={initialErrorStatus}
			initialToday={kigaliCalendarDate(new Date())}
			initialPlans={initialPlans}
			initialPlanCursor={initialPlanCursor}
			planFilterUnavailable={planFilterUnavailable}
		/>
	);
}
