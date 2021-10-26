import Router from "next/router";
import { useEffect,useState } from "react";
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';

const OrderShow = ({order,currentUser}) => {
    const [timeLeft,setTimeLeft] = useState(0);
    const {doRequest,errors} = useRequest({
        url:'/api/payments',
        method:'post',
        body:{
            orderId:order.id
        },
        onSuccess:(payment)=>Router.push('/orders'),
    });

    useEffect(()=>{
        const findTimeLeft = () =>{
            const msLeft = new Date(order.expiresAt) - new Date();
            setTimeLeft(Math.round(msLeft / 1000));
        };

        findTimeLeft();
        const timerId = setInterval(findTimeLeft,1000);

        return ()=>{
            clearInterval(timerId);
        };
    },[order]);

    if(timeLeft<0){
        return 'Order Expired'
    }

    return (<div>
        Time left to pay: {timeLeft} seconds
        <StripeCheckout
            token={(payment)=>doRequest({token:"card_1Jn6GWJTpnx8xCTjKX73Pnyg"})}
            stripeKey="pk_test_51HEBS4JTpnx8xCTjK8VPJhNbRjb6N1WGnrUrpOue7LvxzPMWdrdxSyWBWi3XUkmEeq4LDxK7gQqj6CJL4FfZTSqr001U3WCR3o"
            amount={order.ticket.price * 100}
            email={currentUser.email}
        />
        {errors}
    </div>);
};

OrderShow.getInitialProps = async (context,client)=>{
    const {orderId} = context.query;
    const {data} = await client.get(`/api/orders/${orderId}`);

    return {order:data};
}

export default OrderShow;