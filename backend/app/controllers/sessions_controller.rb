class SessionsController < ApplicationController
  def destroy
    reset_session
    render json: { status: "ok" }
  end
end
