import { Star } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

type Props = {
    open: boolean;
    onClose: (open: boolean) => void;
    feedbackData: {
        name: string;
        email: string;
        rating: number;
        feedback: string;
    };
    setFeedbackData: (data: any) => void;
    onSubmit: () => void;
    submitting: boolean;
};

export default function RatingFeedbackModal({
    open,
    onClose,
    feedbackData,
    setFeedbackData,
    onSubmit,
    submitting,
}: Props) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent
                className="
        sm:max-w-[425px] rounded-2xl border-none shadow-xl
        bg-white text-black 
        dark:bg-[#0f0f0f] dark:text-white
      "
            >
                <DialogHeader>
                    <DialogTitle className="text-center text-lg font-semibold">
                        Rate Your Experience
                    </DialogTitle>
                    <DialogDescription className="text-center text-sm text-gray-600 dark:text-gray-400">
                        We’d love to hear your feedback.
                    </DialogDescription>
                </DialogHeader>

                {/* Rating */}
                <div className="flex justify-center gap-2 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            className={`w-8 h-8 cursor-pointer transition ${feedbackData.rating >= star
                                    ? "text-orange-500 fill-orange-500"
                                    : "text-gray-400"
                                }`}
                            onClick={() =>
                                setFeedbackData({ ...feedbackData, rating: star })
                            }
                        />
                    ))}
                </div>

                {/* Inputs */}
                <div className="space-y-3 mt-4">
                    <input
                        value={feedbackData.name}
                        onChange={(e) =>
                            setFeedbackData({ ...feedbackData, name: e.target.value })
                        }
                        placeholder="Your Name"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />

                    <input
                        type="email"
                        value={feedbackData.email}
                        onChange={(e) =>
                            setFeedbackData({ ...feedbackData, email: e.target.value })
                        }
                        placeholder="Email"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />

                    <textarea
                        value={feedbackData.feedback}
                        onChange={(e) =>
                            setFeedbackData({ ...feedbackData, feedback: e.target.value })
                        }
                        placeholder="Your feedback..."
                        rows={3}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 mt-5">
                    <button
                        onClick={() => onClose(false)}
                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onSubmit}
                        disabled={submitting}
                        className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50"
                    >
                        {submitting ? "Submitting..." : "Submit"}
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}