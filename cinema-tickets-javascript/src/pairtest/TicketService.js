import InvalidPurchaseException from "./lib/InvalidPurchaseException.js";
import TicketPaymentService from "../thirdparty/paymentgateway/TicketPaymentService.js";
import SeatReservationService from "../thirdparty/seatbooking/SeatReservationService.js";
import TicketCalculation from "./TicketCalculation.js";

export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */
  paymentService;
  seatReservationService;

  constructor(
    paymentService = new TicketPaymentService(),
    seatReservationService = new SeatReservationService()
  ) {
    this.paymentService = paymentService;
    this.seatReservationService = seatReservationService;
  }

  purchaseTickets(accountId, ...ticketTypeRequests) {
    try {
      const ticketCalculation = new TicketCalculation(ticketTypeRequests);

      const result = ticketCalculation.ticketReservation();

      if (!result) {
        throw new InvalidPurchaseException(
          "Something went wrong, please try again"
        );
      } else {
        this.seatReservationService.reserveSeat(accountId, result.data.price);
        this.paymentService.makePayment(accountId, result.data.seats);
      }

      return result;
    } catch (error) {
      console.log(error.message);
    }
  }
}
