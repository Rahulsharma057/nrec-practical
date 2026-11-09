import { forwardRef } from "react";

const SUB_ROW_H = 45.6;
const HEAD_ROW_H = 34.3;
const BODY_H = 847.8;

const IndexPage = forwardRef(function IndexPage({ t }, ref) {
  const rows = t.indexRows || [];
  const rowHeight = rows.length ? (BODY_H - SUB_ROW_H - HEAD_ROW_H) / rows.length : 76.8;

  return (
    <div className="page" ref={ref}>
      <div className="ix-title">INDEX</div>
      <table className="ix-table">
        <tbody>
          <tr>
            <td className="c-sr" style={{ height: SUB_ROW_H }} />
            <td className="c-ct" style={{ height: SUB_ROW_H }}>
              <span className="ix-sub" data-fit-shrink="544,28">
                {t.indexHeading}
              </span>
            </td>
            <td className="c-pg" style={{ height: SUB_ROW_H }} />
          </tr>
          <tr>
            <td className="c-sr ix-hd" style={{ height: HEAD_ROW_H }}>SR. NO.</td>
            <td className="c-ct ix-hd" style={{ height: HEAD_ROW_H }}>CONTENT</td>
            <td className="c-pg ix-hd" style={{ height: HEAD_ROW_H }}>PAGE NO.</td>
          </tr>
          {rows.map((text, i) => (
            <tr key={i}>
              <td className="c-sr ix-num" style={{ height: rowHeight }}>{i + 1}</td>
              <td className="c-ct" style={{ height: rowHeight }}>
                <span className="ix-dev" data-fit-shrink="544,17">{text}</span>
              </td>
              <td className="c-pg" style={{ height: rowHeight }} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default IndexPage;
