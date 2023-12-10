class ProfilesController < ApplicationController
  before_action :authenticate_user!

  def show
    render json: { username: current_user.username }
  end
end
