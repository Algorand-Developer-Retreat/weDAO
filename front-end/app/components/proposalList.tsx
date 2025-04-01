import { Proposal } from "../interfaces/proposals";
import { ProposalCard } from "./proposalCard";

interface ProposalListProps {
    proposals: Proposal[]
}

export function ProposalList({proposals}: ProposalListProps) {

    return (
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-10">   
            {proposals.map((proposal) => (
                <ProposalCard yesPercent={0} noPercent={0} timeLeft={""} key={proposal.id} {...proposal} />
            ))}
        </div>
    )
}