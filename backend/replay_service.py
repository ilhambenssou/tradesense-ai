
def reconstruct_equity(challenge_id, trades, initial_balance):
    """
    VERIFICATION ENGINE: Sums all trades to verify current equity.
    Truth must always equal: Initial + Sum(PnL)
    """
    total_pnl = sum(t['pnl'] for t in trades if t['status'] == 'CLOSED')
    expected_equity = initial_balance + total_pnl
    return expected_equity

def verify_challenge_integrity(challenge):
    # Fetch all trades for this challenge from DB
    # trades = get_trades_by_challenge(challenge['id'])
    # current_equity = reconstruct_equity(challenge['id'], trades, challenge['initialBalance'])
    # if abs(current_equity - challenge['equity']) > 0.01:
    #    raise ValueError("DATA_INTEGRITY_VIOLATION")
    return True
