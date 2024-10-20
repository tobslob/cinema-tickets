export default class TicketCalculation {
  ADULT_COST = 25;
  CHILD_COST = 15;
  totalTickets = 0;
  adultTickets = 0;
  childTickets = 0;
  infantTickets = 0;

  constructor(requests) {
    this.#computeTicket(requests);
  }

  // compute totalTickets, adultTickets, childTickets and infantTickets
  #computeTicket(requests) {
    for (const request of requests) {
      const ticketType = request.getTicketType();
      const noOfTicket = request.getNoOfTickets();

      this.totalTickets += noOfTicket;

      if (ticketType === "ADULT") {
        this.adultTickets = noOfTicket;
      } else if (ticketType === "CHILD") {
        this.childTickets = noOfTicket;
      } else {
        this.infantTickets = noOfTicket;
      }
    }
  }

  ticketReservation() {
    if (this.totalTickets < 1 || this.totalTickets > 25) {
      throw new Error("You cannot book less than 1 or more than 25 tickets per booking.");
    }

    if (this.adultTickets === 0) {
      throw new Error(
        "Child or infant tickets cannot be purchased without an adult ticket purchase."
      );
    }

    return {
      status: "Success",
      data: {
        price:
          this.adultTickets * this.ADULT_COST +
          this.childTickets * this.CHILD_COST,

        seats: this.adultTickets + this.childTickets,
      },
    };
  }
}
