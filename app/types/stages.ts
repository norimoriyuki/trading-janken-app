export interface Stage {
    id: number;
    name: string;
    requiredWins: number;  // 開放に必要な勝利数
}

export const stages: Stage[] = [
    { id: 1, name: 'Stage 1', requiredWins: 0 }, // 最初から開放
    { id: 2, name: 'Stage 2', requiredWins: 5 },
    { id: 3, name: 'Stage 3', requiredWins: 5 },
    { id: 4, name: 'Stage 4', requiredWins: 5 },
    { id: 5, name: 'Stage 5', requiredWins: 5 },
    { id: 6, name: 'Stage 6', requiredWins: 5 },
];
