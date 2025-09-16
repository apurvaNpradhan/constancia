export function getDayPeriod(date: Date): "morning" | "afternoon" | "evening" {
   if (!(date instanceof Date) || isNaN(date.getTime())) {
      throw new Error("Invalid date provided");
   }

   const hour = date.getHours();

   if (hour >= 5 && hour < 12) {
      return "morning";
   } else if (hour >= 12 && hour < 17) {
      return "afternoon";
   } else {
      return "evening";
   }
}
