import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import TrashIcon from "../icons/TrashIcon";
import { Column, Id, Task } from "../types";
import TaskCard from "./TaskCard";

interface Props {
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;
  createTask: (columnId: Id) => void;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
  task: Task[];
}

function ColumnContainer(props: Props) {
  const {
    column,
    deleteColumn,
    updateColumn,
    createTask,
    task,
    deleteTask,
    updateTask,
  } = props;

  const [editMode, setEditMode] = useState(false);

  const taskIds = useMemo(() => {
    return task.map((task) => task.id);
  }, [task]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-columnBackgroundColor opacity-40 border-2 border-rose-500 w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-columnBackgroundColor  w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col"
    >
      {/* Column title */}
      <div
        {...attributes}
        {...listeners}
        onClick={() => {
          setEditMode(true);
        }}
        className="bg-mainBackgroundColor text-md h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-columnBackgroundColor border-4 flex items-center justify-between"
      >
        <div className="flex gap-2">
          <div className="flex items-center justify-center px-2 py-1 text-sm rounded-full bg-columnBackgroundColor">
            0
          </div>
          {!editMode && column.title}
          {editMode && (
            <input
              className="px-2 bg-black border rounded outline-none focus:border-rose-500"
              value={column.title}
              onChange={(e) => updateColumn(column.id, e.target.value)}
              autoFocus
              onBlur={() => setEditMode(false)}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
            />
          )}
        </div>
        <button
          className="px-1 py-2 rounded stroke-gray-500 hover:stroke-white hover:bg-columnBackgroundColor"
          onClick={() => {
            deleteColumn(column.id);
          }}
        >
          <TrashIcon />
        </button>
      </div>

      {/* Column container */}
      <div className="flex flex-col flex-grow gap-4 p-2 overflow-x-hidden overflow-y-auto">
        <SortableContext items={taskIds}>
          {task.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))}
        </SortableContext>
      </div>
      {/* Column footer */}
      <button
        className="flex items-center gap-2 p-4 border-2 rounded-md border-columnBackgroundColor border-x-columnBackgroundColor hover:bg-mainBackgroundColor hover:text-rose-500 active:bg-black"
        onClick={() => {
          createTask(column.id);
        }}
      >
        <PlusIcon />
        Add Task
      </button>
    </div>
  );
}

export default ColumnContainer;
