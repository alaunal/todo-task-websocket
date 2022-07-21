const TodoItem = ({ todo, onDelete, onStatus }) => {

  return (
    <div className={"p-3 max-h-14 flex align-center justify-between border"}>
      <span className={"truncate flex-grow"}>
        <input
          className="cursor-pointer mr-2"
          onChange={(e) => {
            e.stopPropagation();
            onStatus();
        }}
          type="checkbox"
          checked={todo.is_complete ? true : ""}
        />
        <span
          className={`w-full flex-grow ${todo.is_complete ? "line-through" : ""}`}
        >
          {todo.task}
        </span>
      </span>
      <button
        className={"font-mono text-red-500 text-xl border px-2"}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDelete();
        }}
      >
        X
      </button>
    </div>
  );
};

export default TodoItem;
