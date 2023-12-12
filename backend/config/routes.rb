Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :webauthn do
    namespace :attestation do
      resource :registration, only: [:create]
      resource :session, only: [:create]
    end
    namespace :assertion do
      resource :options, only: [:create]
      resource :session, only: [:create]
    end
  end

  resource :me, only: [:show]
  resource :profile, only: [:show]
  resource :session, only: [:destroy]
end
