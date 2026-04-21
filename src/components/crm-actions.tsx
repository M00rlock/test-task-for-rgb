"use client";

import { PencilLine, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

type RecordActionsProps = {
  onEdit: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
};

export function RecordActions({ onEdit, onDelete, isDeleting = false }: RecordActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="border-slate-200 bg-white"
        onClick={onEdit}
      >
        <PencilLine className="h-4 w-4" />
        Edit
      </Button>
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="border-rose-200 bg-white text-rose-700 hover:bg-rose-50"
        onClick={onDelete}
        disabled={isDeleting}
      >
        <Trash2 className="h-4 w-4" />
        {isDeleting ? "Deleting..." : "Delete"}
      </Button>
    </div>
  );
}

type FormActionsProps = {
  submitLabel: string;
  isSubmitting: boolean;
  onCancel?: () => void;
};

export function FormActions({ submitLabel, isSubmitting, onCancel }: FormActionsProps) {
  return (
    <div className="flex flex-wrap gap-3 pt-2">
      <Button type="submit" className="flex-1" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : submitLabel}
      </Button>
      {onCancel ? (
        <Button type="button" variant="outline" className="border-slate-200 bg-white" onClick={onCancel}>
          Cancel
        </Button>
      ) : null}
    </div>
  );
}
