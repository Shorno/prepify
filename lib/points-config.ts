export const POINTS_CONFIG = {
    NOTE_CREATED: 5,

    // File type points (per file)
    FILE_PDF: 2,
    FILE_IMAGE: 1,

    // Resource/reference points (per resource)
    RESOURCE_ADDED: 2,

    FIRST_NOTE: 10, // Bonus for first note
    MULTIPLE_FILES_BONUS: 2, // Bonus if 3+ files
    COMPLETE_NOTE_BONUS: 5, // Bonus if has files + resources

    // Milestones
    MILESTONE_5_NOTES: 50,
    MILESTONE_10_NOTES: 100,
    MILESTONE_25_NOTES: 250,
    MILESTONE_50_NOTES: 500,
} as const;

export type PointReason =
    | 'note_created'
    | 'file_pdf'
    | 'file_image'
    | 'resource_added'
    | 'first_note'
    | 'multiple_files_bonus'
    | 'complete_note_bonus'
    | 'milestone';

export function getFileType(url: string): 'pdf' | 'image' | null {
    const ext = url.split('.').pop()?.toLowerCase();

    if (ext === 'pdf') return 'pdf';
    if (['jpg', 'jpeg', 'png', 'webp'].includes(ext || '')) return 'image';

    return null;
}

// Calculate points for a note
export function calculateNotePoints(data: {
    files: string[];
    resources: number;
    isFirstNote: boolean;
}): {
    total: number;
    breakdown: Array<{reason: string; points: number}>;
} {
    const breakdown: Array<{reason: string; points: number}> = [];
    let total = 0;

    breakdown.push({reason: 'Note created', points: POINTS_CONFIG.NOTE_CREATED});
    total += POINTS_CONFIG.NOTE_CREATED;

    if (data.isFirstNote) {
        breakdown.push({reason: 'First note bonus', points: POINTS_CONFIG.FIRST_NOTE});
        total += POINTS_CONFIG.FIRST_NOTE;
    }

    data.files.forEach((fileUrl) => {
        const fileType = getFileType(fileUrl);

        if (fileType === 'pdf') {
            breakdown.push({reason: 'PDF file', points: POINTS_CONFIG.FILE_PDF});
            total += POINTS_CONFIG.FILE_PDF;
        } else if (fileType === 'image') {
            breakdown.push({reason: 'Image file', points: POINTS_CONFIG.FILE_IMAGE});
            total += POINTS_CONFIG.FILE_IMAGE;
        }
    });

    if (data.files.length >= 3) {
        breakdown.push({reason: 'Multiple files bonus', points: POINTS_CONFIG.MULTIPLE_FILES_BONUS});
        total += POINTS_CONFIG.MULTIPLE_FILES_BONUS;
    }

    const resourcePoints = data.resources * POINTS_CONFIG.RESOURCE_ADDED;
    if (resourcePoints > 0) {
        breakdown.push({reason: `${data.resources} resources`, points: resourcePoints});
        total += resourcePoints;
    }

    if (data.files.length > 0 && data.resources > 0) {
        breakdown.push({reason: 'Complete note bonus', points: POINTS_CONFIG.COMPLETE_NOTE_BONUS});
        total += POINTS_CONFIG.COMPLETE_NOTE_BONUS;
    }

    return {total, breakdown};
}