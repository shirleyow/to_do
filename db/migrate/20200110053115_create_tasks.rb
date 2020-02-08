class CreateTasks < ActiveRecord::Migration[6.0]
  def change
    create_table :tasks do |t|
      t.string :title, null:false
      t.text :description
      t.date :deadline
      t.text :tags, array: true, default: []

      t.timestamps
    end
  end
end
