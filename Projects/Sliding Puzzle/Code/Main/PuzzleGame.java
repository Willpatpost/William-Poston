//William Poston
//05-05-2024

package main;

import javax.swing.JFrame;
import javax.swing.JPanel;
import java.awt.BorderLayout;

public class PuzzleGame {
    public static void main(String[] args) {
        JFrame frame = new JFrame("Sliding Puzzle Game");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setSize(600, 600);
        frame.setResizable(true); // Allow resizing

        JPanel mainPanel = new JPanel(new BorderLayout());
        frame.add(mainPanel);

        PuzzlePanel puzzlePanel = new PuzzlePanel();
        mainPanel.add(puzzlePanel, BorderLayout.CENTER);

        frame.setVisible(true);
    }
}
