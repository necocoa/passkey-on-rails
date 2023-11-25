class User < ApplicationRecord
  has_many :webauthn_credentials, dependent: :destroy

  # ユーザー名は英数字、アンダースコア、ハイフンのみを許可
  VALID_USERNAME_REGEX = /\A[\w-]+\z/.freeze
  validates :username, presence: true,
                       length: { maximum: 50 },
                       format: { with: VALID_USERNAME_REGEX },
                       uniqueness: { case_sensitive: false }
  validates :webauthn_id, presence: true
end
