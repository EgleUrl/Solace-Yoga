import React from "react";
import './ContactSection.css'; // CSS file for styling

function Map() {
    return (
        <div className="map-container">
            <h2 className="mt-4 mb-0">Find Us Here</h2>
            <iframe
                title="Solace Yoga Studio Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d870.3643661673756!2d-0.2388815600777544!3d52.5710908877555!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4877f0554a278813%3A0xb022a3bc336b266e!2sBurghley!5e0!3m2!1slt!2suk!4v1744382459098!5m2!1slt!2suk"   
                width="80%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
        </div>
    );
  }
  export default Map;