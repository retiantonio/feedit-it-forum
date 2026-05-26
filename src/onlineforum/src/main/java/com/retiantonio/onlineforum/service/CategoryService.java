package com.retiantonio.onlineforum.service;

import com.retiantonio.onlineforum.dtos.request.CategoryRequest;
import com.retiantonio.onlineforum.dtos.response.CategoryResponse;
import com.retiantonio.onlineforum.exceptions.AlreadyExistsException;
import com.retiantonio.onlineforum.exceptions.ResourceNotFoundException;
import com.retiantonio.onlineforum.model.Category;
import com.retiantonio.onlineforum.repository.CategoryRepository;
import com.retiantonio.onlineforum.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final QuestionRepository questionRepository;

    private CategoryResponse toResponse(Category c) {
        CategoryResponse res = new CategoryResponse();
        res.setId(c.getId());
        res.setName(c.getName());
        res.setColor(c.getColor());
        return res;
    }

    public List<CategoryResponse> getAll() {
        return categoryRepository.findAll()
                .stream().map(this::toResponse).toList();
    }

    public CategoryResponse create(CategoryRequest request) {
        if (categoryRepository.existsByNameIgnoreCase(request.getName())) {
            throw new AlreadyExistsException("Category already exists");
        }
        Category category = new Category();
        category.setName(request.getName());
        category.setColor(request.getColor());
        return toResponse(categoryRepository.save(category));
    }

    public CategoryResponse update(Long id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        category.setName(request.getName());
        category.setColor(request.getColor());
        return toResponse(categoryRepository.save(category));
    }

    public void delete(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        if (questionRepository.existsByCategoriesContaining(category)) {
            throw new AlreadyExistsException(
                    "Cannot delete category — it is still assigned to one or more questions"
            );
        }

        categoryRepository.delete(category);
    }
}