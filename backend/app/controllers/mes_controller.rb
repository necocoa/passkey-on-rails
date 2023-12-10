class MesController < ApplicationController
  before_action :authenticate_user!

  def show
    render json: { id: current_user.id, username: current_user.username }
  end
end
