/** Scalable implementation of the approved folded-payslip identity. */
export default function BrandLogo() {
  return (
    <span className="paye-brand" aria-label="PAYE Calculator">
      <svg viewBox="0 0 64 76" aria-hidden="true" focusable="false">
        <path fill="#f04c40" d="M5 0h25v24q0 5 5 5l29 3v39q0 5-5 5L0 66V5q0-5 5-5Z" />
        <path fill="#f04c40" d="m34 0 30 29-24-7Z" />
        <path fill="#f6f2e8" d="m10 38 43 3v8l-43-3Zm0 15 43 3v8l-43-3Z" />
      </svg>
      <span className="paye-brand-words"><strong>PAYE</strong><span>Calculator</span></span>
    </span>
  )
}
