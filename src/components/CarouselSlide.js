import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './CarouselSlide.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom';

const CarouselSlide = ({books}) => {
  const navigate = useNavigate();

  // const handleImageClick = (id, event) => {
  //   event.stopPropagation();
  //   navigate(`/book/${id}`);
  // };

  return (
    <div className="carousel-container">
      <Carousel showArrows={true} infiniteLoop={true} showThumbs={false} showStatus={true} autoPlay={true} interval={3000}>
        {/* {books?.map((book,i)=>(
          <div key={i} onClick={(e)=>handleImageClick(book._id, e)}>
            <img src={book?.cover} width="100" alt={`Slide${i}`} className="carousel-image" />
          </div>
        ))} */}
        <div>
          <img src="/carousel/cr1.png" alt="Slide 1" className="carousel-image" />
        </div>
        <div>
          <img src="/carousel/cr2.png" alt="Slide 2" className="carousel-image" />
        </div>
        <div>
          <img src="/carousel/cr3.png" alt="Slide 3" className="carousel-image" />
        </div>
      </Carousel>
    </div>
  );
};

export default CarouselSlide;
