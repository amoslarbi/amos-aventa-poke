// Readable date format function
export function formatDateTime(date: string): string {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/Berlin",
      hour12: false,
    }).format(new Date(date));
  }