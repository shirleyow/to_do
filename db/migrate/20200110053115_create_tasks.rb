class CreateTasks < ActiveRecord::Migration[6.0]
  def change
    create_table :tasks do |t|
      t.string :title, null:false
      t.text :description
      t.date :deadline
      t.text :tags, array: true, default: []
	  t.boolean :completed, default: false

      t.timestamps
    end
  end
end
