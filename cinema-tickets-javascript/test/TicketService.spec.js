import TicketService from "../src/pairtest/TicketService.js";
import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest";
import TicketPaymentService from "../src/thirdparty/paymentgateway/TicketPaymentService.js";
import SeatReservationService from "../src/thirdparty/seatbooking/SeatReservationService.js";

import { jest } from "@jest/globals";

describe("TicketService", () => {
  let ticketService;
  let paymentService;
  let reservationService;

  beforeEach(() => {
    paymentService = new TicketPaymentService();
    reservationService = new SeatReservationService();
    ticketService = new TicketService(paymentService, reservationService);

    jest.spyOn(paymentService, "makePayment");
    jest.spyOn(reservationService, "reserveSeat");
  });

  it("should purchase tickets successfully when valid requests are provided", () => {
    const adultRequest = new TicketTypeRequest("ADULT", 2);
    const childRequest = new TicketTypeRequest("CHILD", 1);
    const infantRequest = new TicketTypeRequest("INFANT", 1);

    const response = ticketService.purchaseTickets(
      123456,
      adultRequest,
      childRequest,
      infantRequest
    );

    expect(response.status).toBe("Success");
    expect(response.data.price).toBe(65);
    expect(response.data.seats).toBe(3);

    expect(paymentService.makePayment).toHaveBeenCalledWith(123456, 65);
    expect(reservationService.reserveSeat).toHaveBeenCalledWith(123456, 3);
  });

  test("should throw an error when more than 25 tickets are requested", () => {
    const adultRequest = new TicketTypeRequest("ADULT", 26);

    expect(() => {
      ticketService.purchaseTickets(123456, adultRequest);
    }).toThrowError(
      new Error("You cannot book more than 25 tickets per booking.")
    );
  });

  test("should throw an error when child or infant tickets exceed the number of adult tickets", () => {
    const adultRequest = new TicketTypeRequest("ADULT", 1);
    const childRequest = new TicketTypeRequest("CHILD", 2);

    expect(() => {
      ticketService.purchaseTickets(123456, adultRequest, childRequest);
    }).toThrowError(
      new Error(
        "Child or infant tickets cannot exceed the number of adult tickets purchased."
      )
    );
  });

  test("should throw an error if accountId is not an integer", () => {
    const adultRequest = new TicketTypeRequest("ADULT", 2);

    expect(() => {
      ticketService.purchaseTickets("invalidId", adultRequest);
    }).toThrowError(new TypeError("accountId must be an integer"));
  });

  test("should handle zero tickets gracefully", () => {
    const adultRequest = new TicketTypeRequest("ADULT", 0);

    expect(() => {
      ticketService.purchaseTickets(123456, adultRequest);
    }).toThrowError(
      new Error("You cannot book more than 25 tickets per booking.")
    );
  });
});
