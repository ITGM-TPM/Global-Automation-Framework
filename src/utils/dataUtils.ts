// src/utils/dateUtils.ts

export function getPromotionStartDate(): string {
    const today = new Date();
    const day = today.getDay(); // 0=Sun, 1=Mon, ... 6=Sat

    let daysToNextMonday = (1 - day + 7) % 7;
    if (daysToNextMonday === 0) daysToNextMonday = 7;

    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + daysToNextMonday);

    const month = nextMonday.getMonth() + 1;
    const date = nextMonday.getDate();
    const year = nextMonday.getFullYear();

    return `${month}/${date}/${year}`;
}

export function getPromotionName(): string {

    const num = Math.floor(Math.random() * 9999) + 1; // 1 to 9999
    const padded = num.toString().padStart(4, '0');   // ensures 4 digits
    return `Test_${padded}`;

}