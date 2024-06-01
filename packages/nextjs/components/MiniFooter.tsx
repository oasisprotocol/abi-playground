export const MiniFooter = () => {
  return (
    <div className="flex justify-center items-center gap-1 text-xs w-full mt-10 z-10">
      <div className="mb-1">
        <span>
          Source at:
          <a
            href="https://github.com/lukaw3d/abi-playground-sapphire"
            target="_blank"
            rel="noreferrer"
            className="link"
          >
            lukaw3d/abi-playground-sapphire
          </a>
        </span>
        &nbsp;·&nbsp;
        <span>
          Forked from:
          <a href="https://github.com/BuidlGuidl/abi.ninja" target="_blank" rel="noreferrer" className="link">
            BuidlGuidl/abi.ninja
          </a>
        </span>
      </div>
    </div>
  );
};
