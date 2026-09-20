import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_BASE = "http://localhost:5050/characters";

const CharacterRow = ({ record, deleteRecord }) => {
  const classDisplay = record.classes
    ? record.classes.map((c) => `${c.class} ${c.level}`).join(" / ")
    : "";

  return (
    <tr className="border-b transition-colors hover:bg-muted/50">
      <td className="p-4 align-middle">{record.name}</td>
      <td className="p-4 align-middle">{record.totalLevel}</td>
      <td className="p-4 align-middle">{classDisplay}</td>
      <td className="p-4 align-middle">
        <div className="flex gap-2">
          <Link
            className="btn btn-sm btn-outline"
            to={`/play/${record._id}`}
          >
            Play
          </Link>
          <Link
            className="btn btn-sm btn-outline"
            to={`/edit/${record._id}`}
          >
            Edit
          </Link>
          <button
            className="btn btn-sm btn-outline btn-error"
            type="button"
            onClick={() => deleteRecord(record._id)}
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default function RecordList() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    async function getRecords() {
      const response = await fetch(API_BASE);
      if (!response.ok) {
        console.error(`An error occurred: ${response.statusText}`);
        return;
      }
      const records = await response.json();
      setRecords(records);
    }
    getRecords();
  }, [records.length]);

  async function deleteRecord(id) {
    await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    const newRecords = records.filter((el) => el._id !== id);
    setRecords(newRecords);
  }

  return (
    <>
      <h3 className="text-lg font-semibold p-4">Character List</h3>
      <div className="border rounded-lg overflow-hidden">
        <div className="relative w-full overflow-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th className="h-12 px-4 text-left align-middle font-medium">
                  Name
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium">
                  Level
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium">
                  Class
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <CharacterRow
                  record={record}
                  deleteRecord={deleteRecord}
                  key={record._id}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
