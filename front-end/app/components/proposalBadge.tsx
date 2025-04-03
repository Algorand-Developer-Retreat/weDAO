import React from 'react';
import { FaQuestionCircle, FaTrophy } from 'react-icons/fa';

type ProposalType = 'simple' | 'reward';

interface ProposalBadgeProps {
    type: ProposalType;
    assetId: number;
}

export const ProposalBadge: React.FC<ProposalBadgeProps> = ({ type }) => {
    const renderIcon = () => {
        switch (type) {
            case 'simple':
                return <FaQuestionCircle className="text-primary h-6 w-6" />;
            case 'reward':
                return <FaTrophy className="text-primary h-6 w-6" />;
            default:
                return null;
        }
    };

    return (
        <div className="flex items-center p-0.5 rounded-full">
            {renderIcon()}
        </div>
    );
};

