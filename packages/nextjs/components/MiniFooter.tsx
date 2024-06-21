export const MiniFooter = () => {
  return (
    <div className="text-center text-xs mt-10 mb-1 z-10">
      <div>
        Source at:{" "}
        <a href="https://github.com/oasisprotocol/abi-playground" target="_blank" rel="noreferrer" className="link">
          oasisprotocol/abi-playground
        </a>
      </div>
      <div>
        Forked from:{" "}
        <a href="https://github.com/BuidlGuidl/abi.ninja" target="_blank" rel="noreferrer" className="link">
          BuidlGuidl/abi.ninja
        </a>
      </div>
    </div>
  );
};
