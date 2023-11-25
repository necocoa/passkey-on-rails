class CreateWebauthnCredentials < ActiveRecord::Migration[7.1]
  def change
    create_table :webauthn_credentials do |t|
      t.references :user, null: false, foreign_key: true
      t.string :webauthn_id, null: false, index: { unique: true }
      t.string :public_key, null: false
      t.integer :sign_count, null: false, default: 0

      t.timestamps
    end
  end
end
