import React, { useEffect, useState } from 'react';
import { contractId, marketId, fungibleId } from '../utils/near-utils'
import { BuyCredits } from './BuyCredits';
import { years } from '../utils/format';
import { loadCredits } from '../state/views';
import { formatAmount } from '../utils/format';
import { handlePlaceBid } from '../state/actions';
import Menu from 'url:../img/menu-small.svg';
import Arrow from 'url:../img/arrow.svg';

export const TokenSale = (props) => {

    const { token, account, dispatch, views } = props
    const { credits } = views
    const { token_id, token_type, minBid } = token

    const edition = token_id.split(':')[1]
    const bids = token.bids[fungibleId] || []

    const hasWinningBid = bids[0].owner_id === account?.accountId
    let topBidOwner = bids[0].owner_id
    if (hasWinningBid) {
        topBidOwner = 'Your bid'
    }

    const hasOutbid = !hasWinningBid && bids.some(({ owner_id }) => owner_id === account?.accountId)

    /// TODO sort bids descending

    return <>
        <div className="content">
            <div className="bids-type">
                <div>
                    <div className="label">High</div>
                    <div className="amount">${formatAmount(minBid)}</div>
                </div>
                <div className="ending">
                    <p>Auction ends in:</p>
                    <h2>42 : 13 : 05</h2>
                </div>
            </div>

            <div className="select edition"
                onClick={() => history.push('/edition/' + token_type)}
            >
                <div># {edition}</div>
                <div>{years(edition)}</div>
                <img src={Menu} />
            </div>

            { credits &&
                <p>Credits: {formatAmount(credits)}</p>
            }

            <BuyCredits />

            {
                hasOutbid && <div className="button red center text-white">
                    <div>You were outbid!</div>
                </div>
            }

            {
                hasWinningBid ?
                    <div className="button green center text-white">
                        <div>You have the winning bid!</div>
                    </div>
                    :
                    <div className="button" onClick={() => dispatch(handlePlaceBid(account, token, minBid))}>
                        <div>Place a Bid</div>
                        <img src={Arrow} />
                    </div>
            }

            <div className="bids">
                {
                    !bids.length ? <p>No Bids!</p> :
                        <>

                            <h4>Latest Bids</h4>
                            <div>
                                {
                                    bids.map(({ owner_id, price }, i) => <div key={i}>
                                        <div>{i === 0 ? topBidOwner : owner_id}</div>
                                        <div>{formatAmount(price)}</div>
                                    </div>)
                                }
                            </div>
                        </>
                }
            </div>
        </div>
    </>
};
