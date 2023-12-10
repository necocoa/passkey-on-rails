class ApplicationController < ActionController::API
  include ActionController::Cookies

  private

  def current_user
    return @current_user if defined?(@current_user)

    @current_user = if session[:user_id].present?
                      User.find_by(id: session[:user_id])
                    end
  end

  def authenticate_user!
    unless current_user
      render json: { status: "unauthorized" }, status: :unauthorized
    end
  end
end
