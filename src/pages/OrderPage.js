import { React, useState, useContext } from 'react';
import { GlobalContext } from '../GlobalContext';
import { useNavigate } from 'react-router-dom';
import Section from '../components/Section';

function OrderPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [deliveryInstructions, setDeliveryInstructions] = useState('');
    const [product, setProduct] = useState('');
    const [quantity, setQuantity] = useState('');

    const { setErrorMessage, setErrorActive, setConfirmMessage, setConfirmActive, scrollToTop, baseUrl } = useContext(GlobalContext);
    const redirect = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = {
            name: name,
            email: email,
            address: address,
            deliveryInstructions: deliveryInstructions,
            product: product,
            quantity: quantity,
        };

        // send a POST request to /order
        try {
            const response = await fetch(baseUrl + '/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                const data = await response.json();
                redirect('/');
                window.scrollTo(0, 0)
                scrollToTop()
                setConfirmMessage('Order submitted!');
                setConfirmActive(true);
                setTimeout(() => { setConfirmActive(false)}, 3000);

            } else {
                const data = await response.json();
                setErrorMessage(`${response.status} error: ${data.error}`);
                setErrorActive(true);
                setTimeout(() => {setErrorActive(false)}, 4000);

            }
        } catch (err) {
            setErrorMessage(err.message)
            setErrorActive(true);
            setTimeout(() => {setErrorActive(false)}, 4000);
        }
    }

    return (
        <>
        <Section id='order-section'>
            <header>
                <div>
                    <h2>Welcome to the Store</h2>
                    <p>Fill out the form to order a product.</p>
                </div>
            </header>
            <article>
                <form onSubmit={handleSubmit}>
                    <fieldset>
                        <legend>Personal Information</legend>
                        <label htmlFor="full-name" className="required">Full name</label>
                        <input
                            type="text"
                            autoFocus
                            placeholder="First Last"
                            size="30"
                            maxLength="100"
                            id="full-name"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />

                        <label htmlFor="email" className="required">Email</label>
                        <input
                            type="email"
                            placeholder="email@domain.com"
                            size="30"
                            maxLength="100"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <label htmlFor="address" className="required">Address</label>
                        <input
                            type="text"
                            placeholder="1234 Main St."
                            size="30"
                            maxLength="200"
                            id="address"
                            name="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
                        <label htmlFor="delivery-instructions">Delivery Instructions</label>
                        <textarea
                            placeholder="Special instructions for delivery."
                            maxLength="500"
                            id="delivery-instructions"
                            name="delivery-instructions"
                            value={deliveryInstructions}
                            onChange={(e) => setDeliveryInstructions(e.target.value)}
                        ></textarea>
                    </fieldset>
                    <fieldset>
                        <legend>Listed Items</legend>
                        <table>
                            <caption>Choose one product from the list below.</caption>
                            <colgroup>
                                <col id="company-name" />
                                <col id="product-name" />
                                <col id="price" />
                            </colgroup>
                            <thead>
                            <tr>
                                <th>COMPANY</th>
                                <th>PRODUCT</th>
                                <th>PRICE</th>
                            </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>AGYM</td>
                                    <td>
                                    <span>
                                        <label htmlFor="row-1-product">Spinning Cat Scratcher Ball</label>
                                        <input 
                                            type="radio" 
                                            id="row-1-product" 
                                            name="product" 
                                            value="Spinning Cat Scratcher Ball"
                                            onChange={e => setProduct(e.target.value)}
                                            required 
                                        />
                                    </span>
                                    </td>
                                    <td>52.99</td>
                                </tr>
                                <tr>
                                    <td>Jasonwell</td>
                                    <td>
                                    <span>
                                        <label htmlFor="row-2-product">Foldable Dog Pool</label>
                                        <input 
                                            type="radio" 
                                            id="row-2-product" 
                                            name="product" 
                                            value="Foldable Dog Pool" 
                                            onChange={e => setProduct(e.target.value)}
                                        />
                                    </span>
                                    </td>
                                    <td>27.25</td>
                                </tr>
                                <tr>
                                    <td>Expawlorer</td>
                                    <td>
                                    <span>
                                        <label htmlFor="row-3-product">Dog Fence Window</label>
                                        <input 
                                            type="radio" 
                                            id="row-3-product" 
                                            name="product" 
                                            value="Dog Fence Window"
                                            onChange={e => setProduct(e.target.value)}
                                        />
                                    </span>
                                    </td>
                                    <td>30.50</td>
                                </tr>
                                <tr>
                                    <td>Lollimeow</td>
                                    <td>
                                    <span>
                                        <label htmlFor="row-4-product">Capsule Pet Travel Backpack</label>
                                        <input 
                                            type="radio" 
                                            id="row-4-product" 
                                            name="product" 
                                            value="Capsule Pet Travel Backpack"
                                            onChange={e => setProduct(e.target.value)}
                                        />
                                    </span>
                                    </td>
                                    <td>59.00</td>
                                </tr>
                                <tr>
                                    <td>Drool'd</td>
                                    <td>
                                    <span>
                                        <label htmlFor="row-5-product">Cat Hamster Wheel</label>
                                        <input 
                                            type="radio" 
                                            id="row-5-product" 
                                            name="product" 
                                            value="Cat Hamster Wheel"
                                            onChange={e => setProduct(e.target.value)}
                                        />
                                    </span>
                                    </td>
                                    <td>349.75</td>
                                </tr>
                            </tbody>
                        </table>

                        <label htmlFor="quantity">Quantity</label>
                        <input
                            type="number"
                            placeholder="1-100"
                            min="1"
                            max="100"
                            id="quantity"
                            name="quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            required
                        />
                    </fieldset>
                    <input type="submit" value="Submit" />
                </form>
            </article>
        </Section>
        </>
    )
}

export default OrderPage;