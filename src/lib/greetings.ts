
export function getGreeting(name: string): string {
    const hours = new Date().getHours();
    
    if (hours < 12) {
        return `Shubh Prabhat, ${name}! (Good Morning)`;
    } else if (hours < 17) {
        return `Namaste, ${name}! (Good Afternoon)`;
    } else if (hours < 20) {
        return `Shubh Sandhya, ${name}! (Good Evening)`;
    } else {
        return `Shubh Ratri, ${name}! (Good Night)`;
    }
}
