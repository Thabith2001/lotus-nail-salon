'use client'
import toast from "react-hot-toast";
import axios from "axios";

let isDeleteToastActive = false;

export const HandleDelete = async (id) => {
    if (isDeleteToastActive) return "A delete confirmation is already active.";
    isDeleteToastActive = true;

    return new Promise((resolve) => {
        toast.custom((t) => (
            <div
                className="flex items-start gap-3 p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg text-white">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                    <svg
                        className="w-5 h-5 text-red-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                </div>

                <div className="flex-1">
                    <h3 className="font-semibold text-base mb-1">Delete Booking</h3>
                    <p className="text-sm text-gray-300 mb-3">
                        This action cannot be undone. Are you sure you want to proceed?
                    </p>

                    <div className="flex gap-2 justify-end">
                        <button
                            onClick={async () => {
                                toast.dismiss(t.id);
                                isDeleteToastActive = false;

                                const deleteToast = toast.loading("Deleting booking...");

                                try {
                                    const resp = await axios.delete(`/api/bookings/${id}`);
                                    toast.dismiss(deleteToast);

                                    if (resp.status === 200) {
                                        toast.success("Booking deleted successfully!", {
                                            style: { background: "#10b981", color: "#fff" },
                                        });
                                        resolve("success");
                                    } else {
                                        toast.error("Failed to delete booking.", {
                                            style: { background: "#ef4444", color: "#fff" },
                                        });
                                        resolve("failed");
                                    }
                                } catch (err) {
                                    toast.dismiss(deleteToast);
                                    console.error(err);
                                    toast.error("An error occurred while deleting.", {
                                        style: {background: "#ef4444", color: "#fff"},
                                    });
                                    resolve("An error occurred while deleting.");
                                }
                            }}
                            className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 hover:opacity-90 rounded-lg text-white text-sm font-medium transition-all"
                        >
                            Delete
                        </button>

                        <button
                            onClick={() => {
                                toast.dismiss(t.id);
                                isDeleteToastActive = false;
                                resolve("Delete canceled.");
                            }}
                            className="px-4 py-2 bg-gray-700/60 hover:bg-gray-600 rounded-lg text-white text-sm font-medium transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        ), {
            duration: Infinity,
            id: "delete-toast",
            position: "top-center",
            onClose: () => {
                isDeleteToastActive = false;
            },
        });
    });
};


