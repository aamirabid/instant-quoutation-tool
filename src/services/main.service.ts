import { ADD_ONS, BASE_PRICES, GTA_CITIES } from "@/config/constants";
import { QuoteRequestDTO } from "@/dtos/quote.dto";
import { QuoteBreakdown } from "@/interfaces/quote.interface";
import { HttpException } from "@exceptions/HttpException";
import { isEmpty } from "@utils/util";
import fs from "fs";
import path from "path";

class MainService {
  //HELPER METHODS
  private generateQuoteReference(): string {
    const date = new Date();
    const yyyymmdd = date.toISOString().slice(0, 10).replace(/-/g, "");
    const randomNum = String(Math.floor(Math.random() * 999)).padStart(3, "0");
    return `Q-${yyyymmdd}-${randomNum}`;
  }
  private saveQuoteToFile(quote: any) {
    const quotesDb = path.join(process.cwd(), "quotes-db.json");
    if (!fs.existsSync(quotesDb)) {
      fs.writeFileSync(quotesDb, "[]", "utf8");
    }
    const { formData, finalQuote, referenceNumber } = quote;
    const newEntry = {
      ...formData,
      finalQuote,
      referenceNumber,
      timestamp: new Date().toISOString(),
    };
    const existing = JSON.parse(fs.readFileSync(quotesDb, "utf8"));
    existing.push(newEntry);
    fs.writeFileSync(quotesDb, JSON.stringify(existing, null, 2));
  }
  private checkAddon(projectType: string, propertySize: number): number {
    const extraSqFt = propertySize > 1000 ? propertySize - 1000 : 0;
    const blocksOf500 = Math.ceil(extraSqFt / 500);
    const sizeAddon = ADD_ONS[projectType] * blocksOf500;
    return sizeAddon;
  }
  private scopeModifier(
    projectType: string,
    scopeOfWork: string,
    subtotal: number
  ): number {
    let scopeIncrease = 0;
    if (scopeOfWork === "New Construction") {
      if (projectType === "Basement") scopeIncrease = subtotal * 0.2;
      if (projectType === "Commercial Interior")
        scopeIncrease = subtotal * 0.25;
    }
    return scopeIncrease;
  }
  private locationModifier(fullAddress: string, subtotal: number): number {
    let locationIncrease = 0;
    const isGTA = GTA_CITIES.some((city) =>
      fullAddress.toLowerCase().includes(city)
    );
    if (!isGTA) {
      locationIncrease = subtotal * 0.3;
    }
    return locationIncrease;
  }
  //REQUESTED METHODS
  public async quotation(payload: QuoteRequestDTO): Promise<any> {
    if (isEmpty(payload)) throw new HttpException(400, "Payload is empty");
    const basePrice = BASE_PRICES[payload.projectType];
    if (!basePrice) {
      throw new HttpException(400, "Invalid project type");
    }
    let subtotal = basePrice;
    //CHECK ADDONS
    const sizeAddon = this.checkAddon(
      payload.projectType,
      payload.propertySize
    );
    subtotal += sizeAddon;

    // SCOPE MODIFIER
    const scopeIncrease = this.scopeModifier(
      payload.projectType,
      payload.scopeOfWork,
      subtotal
    );
    subtotal += scopeIncrease;

    // LOCATION MODIFIER
    const locationIncrease = this.locationModifier(
      payload.fullAddress,
      subtotal
    );
    subtotal += locationIncrease;

    // RUSH FEE
    let rushFee = 0;
    if (payload.timelineNeeded === "Rushed") {
      rushFee = subtotal * 0.15;
      subtotal += rushFee;
    }

    const breakdown: QuoteBreakdown = {
      basePrice,
      sizeAddon,
      scopeIncrease,
      locationIncrease,
      rushFee,
    };

    const response = {
      finalQuote: Math.round(subtotal),
      breakdown,
      referenceNumber: this.generateQuoteReference(),
      message:
        "We’ve received your request. A team member will follow up soon.",
    };
    this.saveQuoteToFile({
      formData: payload,
      finalQuote: response.finalQuote,
      referenceNumber: response.referenceNumber,
    });

    return response;
  }
}

export default MainService;
