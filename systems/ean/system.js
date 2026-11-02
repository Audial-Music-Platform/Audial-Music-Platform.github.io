import { SystemCore } from "../core.js";
export class EANSystem extends SystemCore {
  constructor(runtime) {
    super("ean", runtime);
    this.register("checksum", digits => this.checksum(digits));
    this.register("encode13", digits => this.encode13(digits));
    this.register("validate13", value => this.validate13(value));
  }
  checksum(digits) {
    if (typeof digits !== "string" || !/^\d{12}$/.test(digits)) throw new Error("EAN-13 requires twelve data digits");
    const sum = [...digits].reduce((acc, digit, index) => acc + Number(digit) * (index % 2 ? 3 : 1), 0);
    return String((10 - sum % 10) % 10);
  }
  validate13(value) { return typeof value === "string" && /^\d{13}$/.test(value) && this.checksum(value.slice(0,12)) === value[12]; }
  encode13(digits) {
    if (typeof digits !== "string" || !/^\d{12,13}$/.test(digits)) throw new Error("Invalid EAN-13");
    const value = digits.length === 12 ? digits + this.checksum(digits) : digits;
    if (!this.validate13(value)) throw new Error("EAN-13 checksum mismatch");
    const L=["0001101","0011001","0010011","0111101","0100011","0110001","0101111","0111011","0110111","0001011"];
    const G=["0100111","0110011","0011011","0100001","0011101","0111001","0000101","0010001","0001001","0010111"];
    const R=["1110010","1100110","1101100","1000010","1011100","1001110","1010000","1000100","1001000","1110100"];
    const parity=["LLLLLL","LLGLGG","LLGGLG","LLGGGL","LGLLGG","LGGLLG","LGGGLL","LGLGLG","LGLGGL","LGGLGL"];
    let bits="101";
    for(let i=1;i<=6;i++) bits+=(parity[Number(value[0])][i-1]==="L"?L:G)[Number(value[i])];
    bits+="01010";
    for(let i=7;i<13;i++) bits+=R[Number(value[i])];
    return { value, bits:bits+"101" };
  }
}
