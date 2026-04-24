import { test, expect } from '../fixtures/itgbFixtures';
import { PromotionDates } from '../pages/TradePlanningPage';

const TEST_USER      = 'Test Sales Planner';
const PROMOTION_NAME = 'E2E Automation Test Promotion';
const DRAG_WIDTH_PX  = 150;

const REQUIRED_FIELDS = [
    'Name',
    'In-Store Date From',
];

test('TC-01: Create Promotion from Trade Calendar date selection', async ({ tradePage }) => {

    let savedDates: PromotionDates = { startDate: '' };


    await test.step(`Login as "${TEST_USER}" and navigate to Trade Calendar`, async () => {
        await tradePage.navigateToTradeCalendar();
    });

    await test.step('Verify Trade Calendar heading and Default View label are visible', async () => {
        await tradePage.validateTradeCalendarHeadingVisible();
        await tradePage.validateDefaultViewLabelVisible();
    });

    await test.step('Find first empty calendar slot and drag to select a date range', async () => {
        const slot = await tradePage.findFirstAvailableCalendarSlot();
        expect(slot, 'A free calendar slot should be available').not.toBeNull();

        await tradePage.selectDateRangeByDrag(
            slot!.emptyX,
            slot!.emptyY,
            slot!.emptyX + DRAG_WIDTH_PX,
            slot!.emptyY,
        );
    });

    await test.step('Verify promotion creation modal appears with auto-populated dates', async () => {
        await tradePage.waitForPromotionModal();
        await tradePage.validatePromotionModalVisible();
        await tradePage.validateStartDateAutoPopulated();
        await tradePage.validateRequiredFieldsFilled(REQUIRED_FIELDS);

        savedDates = await tradePage.getPromotionDates();
        console.log(`Auto-populated dates — start: ${savedDates.startDate}`);
    });

    await test.step(`Fill promotion name "${PROMOTION_NAME}" and save`, async () => {
        await tradePage.fillPromotionName(PROMOTION_NAME);
        await tradePage.validateFormInEditMode();
        await tradePage.savePromotion();
    });

    await test.step('Verify page returns to view mode (Save button is gone)', async () => {
        await tradePage.validateFormExitedEditMode();
        await tradePage.validateNoErrorToast();
    });

    await test.step('Validate saved promotion dates are correct', async () => {
        await tradePage.validateTradeEntry(savedDates);
    });
});