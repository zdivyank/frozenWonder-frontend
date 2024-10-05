import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function TestimonialCard({
  name = "Anonymous",
  content = "No testimonial provided.",
  avatarSrc = "/img/placeholder.jpg"
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Toggle the expanded state when clicking "Read more" or "Show less"
  const toggleReadMore = () => {
    setIsExpanded((prevState) => !prevState);
  };

  return (
    <div className="card h-100 shadow-sm  mt-5" style={{ borderRadius: '12px', height: 'auto',width:'auto' }}> {/* Set a fixed height */}
      <div className="card-body d-flex flex-column text-center"  style={{ borderRadius: '12px', height: '255px',width:'auto' }}>
        <div className="d-flex align-items-center justify-content-center mb-4">
          <img
            src={avatarSrc}
            alt={name}
            className="rounded-circle "
            style={{ width: '90px', height: '90px', objectFit: 'cover', border: '2px solid #f8f9fa',marginTop:'-50px',zIndex:'999'}}
          />
        </div>
          <div className="d-flex align-items-center justify-content-center ">
            <b className="card-title mb-1">{name}</b>
          </div>
          <blockquote className="blockquote text-start flex-grow-1  mt-1" style={{ overflowY: 'auto', maxHeight: isExpanded ? 'none' : '100px', transition: 'max-height 0.3s ease' }}>
          <p className="mb-0 mt-1" style={{ lineHeight: '1.4', fontSize: '0.875rem' }}>
            {/* Show full content if expanded, otherwise show truncated content */}
            {isExpanded ? (
              <span>
                "{content}"{' '}
                {/* Show a 'Show less' button to collapse the content */}
                <button onClick={toggleReadMore} className="btn btn-link p-0" style={{ textDecoration: 'none' }}>
                  Show less
                </button>
              </span>
            ) : (
              <span>
                {/* Truncate the content to the first 150 characters */}
                "{content.length > 150 ? `${content.substring(0, 100)}...` : content}"{' '}
                {/* Display 'Read more' if content is longer */}
                {content.length > 150 && (
                  <button onClick={toggleReadMore} className="btn btn-link p-0" style={{ textDecoration: 'none' }}>
                    Read more
                  </button>
                )}
              </span>
            )}
          </p>
        </blockquote>
        <br />
      </div>
    </div>
  );
}
