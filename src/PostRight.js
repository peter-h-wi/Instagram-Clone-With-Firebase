import React from 'react';
import {Avatar} from "@material-ui/core";
import "./PostRight.css";

function PostRight({username, email}) {
  return (
    <div className={"postright"}>
      <div>
        <Avatar
            className={"postright_avatar"}
            alt={username}
            src={"/static/images/avatar/1.jpg"}
        />
      </div>
      <div className={"postright_account"}>
        <div className="postright_username">
          <h3>{username}</h3>
        </div>
        <div className="postright_email">
          <h3>{email}</h3>
        </div>
      </div>
      <div className={"postright_switch"}>
        <h3>Switch</h3>
      </div>
    </div>
  );
}

export default PostRight;