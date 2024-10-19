import { input, confirm } from "@inquirer/prompts";
import TicketTypeRequest from "./pairtest/lib/TicketTypeRequest.js";

async function app() {
  console.log("Welcome to cinema ticket booking\n\n");
  const answer = await confirm({
    message: "Continue?",
  });

  if (!answer) {
    console.log("Good bye!");
    return;
  }

  const adult = await input({
    message: "Enter number of adult tickets: ",
    validate: (value) => {
      if (!value.match(/^\d+$/)) {
        return "input can only be number";
      }
      return true;
    },
  });
  const child = await input({
    message: "Enter number of child tickets: ",
    validate: (value) => {
      if (!value.match(/^\d+$/)) {
        return "input can only be number";
      }
      return true;
    },
  });
  const infant = await input({
    message: "Enter number of infants tickets: ",
    validate: (value) => {
      if (!value.match(/^\d+$/)) {
        return "input can only be number";
      }
      return true;
    },
  });

  const adultRequest = new TicketTypeRequest("ADULT", Number(adult));
  const childRequest = new TicketTypeRequest("ADULT", Number(child));
  const infantRequest = new TicketTypeRequest("ADULT", Number(infant));

  console.log(adultRequest);
  console.log(childRequest);
  console.log(infantRequest);
}

app();
