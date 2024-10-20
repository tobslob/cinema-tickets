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
    if (!Number.isInteger(accountId) || accountId < 1) {
      throw new TypeError("accountId must be an integer");
    }

    const ticketCalculation = new TicketCalculation(ticketTypeRequests);
    const result = ticketCalculation.ticketReservation();

    if (!result) {
      throw new InvalidPurchaseException(
        "Something went wrong, please try again"
      );
    }

    this.paymentService.makePayment(accountId, result.data.price);
    this.seatReservationService.reserveSeat(accountId, result.data.seats);

    return result;
  }
}
