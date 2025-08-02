
export function getGreeting(name: string): string {
    const hours = new Date().getHours();
    
    if (hours < 12) {
        return `Good Morning, ${name}!`;
    } else if (hours < 17) {
        return `Good Afternoon, ${name}!`;
    } else if (hours < 20) {
        return `Good Evening, ${name}!`;
    } else {
        return `Good Night, ${name}!`;
    }
}
