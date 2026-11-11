import type { Booking } from "@/lib/types";
import { formatDate } from "@/lib/utils";

/** Optional feature: downloadable PDF receipt for confirmed / completed bookings (client-side jsPDF). */
export async function downloadInvoice(b: Booking) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF();
  const line = (label: string, value: string, y: number) => {
    doc.setFont("helvetica", "normal").setTextColor(110);
    doc.text(label, 20, y);
    doc.setFont("helvetica", "bold").setTextColor(20);
    doc.text(value, 190, y, { align: "right" });
  };

  doc.setFillColor(217, 45, 32).rect(0, 0, 210, 34, "F");
  doc.setTextColor(255).setFont("helvetica", "bold").setFontSize(22).text("StudioSpace", 20, 22);
  doc.setFontSize(11).text("BOOKING INVOICE", 190, 22, { align: "right" });

  doc.setFontSize(11).setTextColor(20).setFont("helvetica", "bold").text(b.studioTitle, 20, 52);
  doc.setFont("helvetica", "normal").setTextColor(110).text(b.studioLocation, 20, 59);

  doc.setFontSize(11);
  line("Invoice no.", b._id.slice(-8).toUpperCase(), 76);
  line("Status", b.status, 86);
  line("Guest", `${b.guestName} (${b.guestEmail})`, 96);
  line("Host", `${b.hostName} (${b.hostEmail})`, 106);
  line("Date", formatDate(b.date), 116);
  line("Time", `${b.startTime} - ${b.endTime} (${b.hours} hr)`, 126);
  doc.setDrawColor(210).line(20, 136, 190, 136);
  line("Hourly rate", `$${b.hourlyRate.toFixed(2)}`, 148);
  line("Studio fee", `$${b.totalPrice.toFixed(2)}`, 158);
  line("Refundable security deposit", `$${b.securityDeposit.toFixed(2)}`, 168);
  doc.setFontSize(14);
  line("Total due", `$${(b.totalPrice + b.securityDeposit).toFixed(2)}`, 184);
  doc.setFontSize(9).setFont("helvetica", "normal").setTextColor(130).text("Thank you for booking with StudioSpace. The security deposit is returned after your session if the space is left as found.", 20, 205, { maxWidth: 170 });

  doc.save(`StudioSpace-invoice-${b._id.slice(-8)}.pdf`);
}
