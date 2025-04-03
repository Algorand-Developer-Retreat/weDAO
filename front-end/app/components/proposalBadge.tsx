import React from 'react';
import { FaTrophy } from 'react-icons/fa';
import { MdQuestionAnswer } from 'react-icons/md';

type ProposalType = 'simple' | 'reward';

interface ProposalBadgeProps {
    type: ProposalType;
}

export const ProposalBadge: React.FC<ProposalBadgeProps> = ({ type }) => {
    const renderIcon = () => {
        switch (type) {
            case 'simple':
                return <MdQuestionAnswer className="text-primary h-6 w-6" />;
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

