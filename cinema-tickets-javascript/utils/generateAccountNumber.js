export default function generateAccountNumber() {
  return Math.floor(Math.random() * 9000000000) + 1000000000
}